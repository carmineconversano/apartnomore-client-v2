import {Component, OnInit} from '@angular/core';
import {CommunityObjectItem} from "../../../interfaces/community/community-object-item";
import {environment} from "../../../../environments/environment";
import {from, Observable, of, OperatorFunction, Subject} from "rxjs";
import {CommunityService} from "../../../services/community/community.service";
import {Router} from "@angular/router";
import {NgxPermissionsService} from "ngx-permissions";
import {catchError, debounceTime, distinctUntilChanged, map, switchMap, tap} from "rxjs/operators";
import {Pageable} from "../../../interfaces/shared/pageable";
import {icon, latLng, MapOptions, marker, PopupOptions, tileLayer} from "leaflet";
import * as L from 'leaflet';
import {GeoSearchControl, OpenStreetMapProvider} from "leaflet-geosearch";
import {AuthService} from "../../../services/auth/auth.service";
import {User} from "../../../interfaces/user/user";
import { MdbCollapseDirective } from 'mdb-angular-ui-kit/collapse';
import {NgbTypeaheadSelectItemEvent} from "@ng-bootstrap/ng-bootstrap";
import {GeolocationService} from "../../../services/geolocation/geolocation.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  communities: CommunityObjectItem[] = [];
  imagePathDefault: string = 'assets/cover.jpg';
  basePathImage = environment.baseUrlImage;
  query: string = "";
  queryChanged: Subject<string> = new Subject<string>();
  throttle = 0;
  distance = 2;
  page = 1;
  provider = new OpenStreetMapProvider();
  private map!: L.Map;
  private user!: User | null;
  pinnedCommunityId: number = -1;
  searching: boolean = false;
  searchFailed: boolean = false;


  constructor(private communityService: CommunityService, private router: Router, private permissionsService: NgxPermissionsService, private authService: AuthService,
              private geoLocationService: GeolocationService) {
  }

  center = latLng(41.902782, 12.496366);
  options: MapOptions = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Open Street Map'})
    ],
    zoom: 15,
    center: this.center
  };
  layers: any = [];

  onMapReady(map: L.Map) {
    this.map = map;
    // @ts-ignore
    // const searchControl = new GeoSearchControl({
    //   provider: this.provider,
    //   style: 'bar',
    //   autoCompleteDelay: 750,
    //   showMarker: false,
    //   showPopup: false,
    //   maxMarkers: 1,
    //   searchLabel: 'Inserisci indirizzo',
    //   updateMap: true
    // });
    // setTimeout(() => {
    //   map.addControl(searchControl);
    // }, 0);

    map.on('geosearch/showlocation', ((event: any) => {
      map.invalidateSize(true);
    }));

    map.on('geosearch/marker/dragend', ((event: any) => {
      map.invalidateSize(true);
    }));
  }

  ngOnInit(): void {
    this.queryChanged.pipe(debounceTime(400)).pipe(map(str => str.trim())).subscribe(text => {
      this.getNearMe();
    })
    this.getNearMe();
  }

  // @ts-ignore
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      // @ts-ignore
      switchMap((term) =>
        from(this.provider.search({query: term})).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )
  inputFormatter = (result: any) => result.label;

  getNearMe(_start: string | number = 0, _end: string | number = 20) {
    this.communityService.getNearMe({
      _start: _start,
      _end: _end,
      query: this.query
    }).subscribe((communityList: Pageable<CommunityObjectItem>) => {
      if (communityList.content.length === 0 && this.query !== '') {
        this.communities = [];
      } else {
        const ids = new Set(this.communities.map(d => d.id));
        this.communities = [...this.communities, ...communityList.content.filter(d => !ids.has(d.id))];
      }
      this.layers = [];
      for (const community of this.communities) {
        if ((community.lat !== undefined && community.lng !== undefined)) {
          const popupContent = `
                <div class="d-flex flex-column align-items-center justify-content-center">
                    <h6 class="m-1">${community.name}</h6>
                    <p class="m-1"><small>${community.description}</small></p>
                    <a class="btn btn-primary rounded text-white" href="/community/subscribed/view/${community.accessLink}">
                        Visita
                    </a>
                </div>`;
          const popupOptions: PopupOptions = {
            'maxWidth': 500,
          }
          this.layers.push(
            marker([community.lat, community.lng], {
              icon: icon({
                iconSize: [ 25, 41 ],
                iconAnchor: [ 13, 41 ],
                iconUrl: 'assets/marker-icon.png',
                shadowUrl: 'assets/marker-shadow.png'
              })
            }).bindPopup(popupContent, popupOptions)
              .on('click', ((event) => {
                console.log(event)
              }))
          )
        }
      }

      this.authService.getCurrentUser().subscribe((user) => {
        this.user = user;
        this.center = latLng(<number>this.user?.address?.lat, <number>this.user?.address?.lng);
        console.log(this.center)
      }, error => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position => {
            this.center = latLng(position.coords.latitude, position.coords.longitude);
          }));
        }
      });

      if (this.map !== null) {
        setTimeout(() => {
          this.map.invalidateSize(true);
        }, 100);
      }
    })
  }

  insideCommunity(accessLink: string) {
    this.router.navigate([`/community/subscribed/view`, accessLink]).then(r => r);
  }

  onScroll(): void {
    this.getNearMe(this.page * 20, ++this.page * 20);
  }

  filter() {

  }

  openMarker(community: CommunityObjectItem) {
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        if (layer.getLatLng().lat == community?.lat && layer.getLatLng().lng == community?.lng) {
          if (community?.id !== this.pinnedCommunityId) {
            console.log('toggling')
            layer.togglePopup();
          }
        }
      }
    });
  }

  pinMarker(community: CommunityObjectItem) {
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        if (layer.getLatLng().lat == community?.lat && layer.getLatLng().lng == community?.lng) {
          this.pinnedCommunityId = this.pinnedCommunityId === community.id ? -1 : community.id;
          if (this.pinnedCommunityId === community.id) {
            if (!layer.isPopupOpen()) {
              layer.togglePopup();
            }
          }
        }
      }
    });
  }

  toggleCollapse($event: MouseEvent, basicCollapse: MdbCollapseDirective, community: CommunityObjectItem) {
    basicCollapse.toggle();
    community.collapsed = basicCollapse.collapsed;
  }

  selectedItem(selectEvent: NgbTypeaheadSelectItemEvent) {
    console.log(selectEvent.item)
    this.center = latLng(selectEvent.item.raw.lan, selectEvent.item.raw.lon);
    // this.getNearLocation()
  }
}
