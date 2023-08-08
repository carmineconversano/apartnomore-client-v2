import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../shared/public-validator";
import {environment} from "../../../../environments/environment";
import {ImageSnippet} from "../../../interfaces/shared/image-snippet";
import {UploadService} from "../../../services/upload/upload.service";
import {CommunityService} from "../../../services/community/community.service";
import {CreateCommunity} from "../../../interfaces/community/create-community";
import {ToastrService} from "ngx-toastr";
import {circle, icon, LatLng, latLng, MapOptions, marker, tileLayer} from "leaflet";
import {GeoSearchControl, OpenStreetMapProvider} from "leaflet-geosearch";
import {Router} from "@angular/router";
import * as L from 'leaflet';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  createCommunityForm!: FormGroup;
  basePathImage = environment.baseUrlImage;
  imagePathDefault: string = 'assets/cover_upload.jpg';
  selectedFile!: ImageSnippet;
  radius: number = 10;
  center = latLng(41.902782, 12.496366);
  options: MapOptions = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Open Street Map'})
    ],
    zoom: 15,
    center: this.center
  };
  layers: any = [
    circle([41.902782, 12.496366], {radius: this.radius}),
    marker([41.902782, 12.496366], {
      icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    })
  ];
  provider = new OpenStreetMapProvider();

  constructor(private formBuilder: FormBuilder, private uploadService: UploadService, private communityService: CommunityService, private toaster: ToastrService, private router: Router) {
  }


  get isPublic(): FormControl {
    return this.createCommunityForm.get('isPublic') as FormControl;
  }


  ngOnInit(): void {
    this.createCommunityForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      isPublic: [true, Validators.required],
      imageId: [null, Validators.required],
      accessLink: [''],
      location: [''],
      lat: [''],
      lng: ['']
    }, {validators: CustomValidators.PublicValidator});
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position => {
        this.center = latLng(position.coords.latitude, position.coords.longitude);
        this.createCommunityForm.patchValue({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      }));
    }
  }

  createCommunity() {
    this.communityService.createCommunity(this.createCommunityForm.value as CreateCommunity).subscribe(community => {
      this.createCommunityForm.reset();
      this.toaster.success('Community creata con successo', 'Success');
      setTimeout(async (): Promise<void> => {
        // after 1000 ms we add the class animated to the login/register card
        await this.router.navigate(['/auth/login']);
      }, 1000);
    }, error => {
      this.toaster.error('Community NON creata', 'Errore');

      setTimeout(async (): Promise<void> => {
        // after 1000 ms we add the class animated to the login/register card
        await this.router.navigate(['/auth/login']);
      }, 1000);
    })
  }

  uploadImage(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet('', file);
      this.selectedFile.pending = true;
      this.uploadService.uploadImage(this.selectedFile.file).subscribe(
        (res) => {
          this.selectedFile.src = res.data || '';
          this.createCommunityForm.patchValue({
            imageId: res.id
          });
          this.onSuccess();
        },
        (err) => {
          this.onError();
        })
    });

    reader.readAsDataURL(file);
  }

  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

  pickLocation($event: any) {
    const latLng: LatLng = Object.create($event.latlng);
    this.layers[0] = circle([latLng.lat, latLng.lng], {radius: this.radius});
    this.layers[1] = marker([latLng.lat, latLng.lng], {
      icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    })
    this.createCommunityForm.patchValue({
      lat: latLng.lat.toString(),
      lng: latLng.lng.toString()
    })
  }

  onMapReady(map: L.Map) {
    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: this.provider,
      style: 'bar',
      autoCompleteDelay: 750,
      showPopup: true,
      maxMarkers: 1,
      searchLabel: 'Inserisci indirizzo',
      marker: {
        icon: new L.Icon.Default(),
        draggable: true,
      },
      updateMap: true
    });
    setTimeout(() => {
      map.addControl(searchControl);
    }, 0);

    map.on('geosearch/showlocation', ((event: any) => {
      this.createCommunityForm.patchValue({
        lat: event.marker._latlng.lat || '',
        lng: event.marker._latlng.lng || ''
      })
    }));

    map.on('geosearch/marker/dragend', ((event: any) => {
      this.createCommunityForm.patchValue({
        lat: event?.location?.lat,
        lng: event?.location?.lng
      })
    }));
  }
}
