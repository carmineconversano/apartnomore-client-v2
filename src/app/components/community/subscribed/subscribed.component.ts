import {Component, OnInit} from '@angular/core';
import {CommunityService} from "../../../services/community/community.service";
import {CommunityObjectItem} from "../../../interfaces/community/community-object-item";
import {Pageable} from "../../../interfaces/shared/pageable";
import {Router} from "@angular/router";
import {NgxPermissionsService} from "ngx-permissions";
import {environment} from "../../../../environments/environment";
import {Subject} from "rxjs";
import {debounceTime, map} from 'rxjs/operators';

@Component({
  selector: 'app-subscribed',
  templateUrl: './subscribed.component.html',
  styleUrls: ['./subscribed.component.scss']
})
export class SubscribedComponent implements OnInit {
  communities: CommunityObjectItem[] = [];
  imagePathDefault: string = 'assets/cover.jpg';
  basePathImage = environment.baseUrlImage;
  query: string = "";
  queryChanged: Subject<string> = new Subject<string>();
  throttle = 0;
  distance = 2;
  page = 1;

  constructor(private communityService: CommunityService, private router: Router, private permissionsService: NgxPermissionsService) {
  }

  ngOnInit(): void {
    this.queryChanged.pipe(debounceTime(400)).pipe(map(str => str.trim())).subscribe(text => {
      this.getSubscribed();
    })
    this.getSubscribed();
  }

  search() {
    console.log(this.query)
    this.queryChanged.next(this.query);
  }

  getSubscribed(_start: string | number = 0, _end: string | number = 20) {
    this.communityService.getSubscribed({
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
    })
  }

  insideCommunity(accessLink: string) {
    this.router.navigate([`/community/subscribed/view`, accessLink]).then(r => r);
  }

  onScroll(): void {
    this.getSubscribed(this.page * 20, ++this.page * 20);
  }
}
