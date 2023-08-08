import {Component, Input, OnInit} from '@angular/core';
import {CommunityObjectItem} from "../../../../interfaces/community/community-object-item";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-community-info',
  templateUrl: './community-info.component.html',
  styleUrls: ['./community-info.component.scss']
})
export class CommunityInfoComponent implements OnInit {

  @Input()
  public community!: CommunityObjectItem

  imagePathDefault: string = 'assets/cover.jpg';
  basePathImage = environment.baseUrlImage;

  constructor() { }

  ngOnInit(): void {
  }

}
