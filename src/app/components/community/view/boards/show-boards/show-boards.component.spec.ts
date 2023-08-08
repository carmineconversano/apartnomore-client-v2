import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ShowBoardsComponent} from './show-boards.component';

describe('BoardsComponent', () => {
  let component: ShowBoardsComponent;
  let fixture: ComponentFixture<ShowBoardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowBoardsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
