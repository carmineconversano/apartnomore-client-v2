import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ViewGeneralComponent} from './view-general.component';

describe('ViewComponent', () => {
  let component: ViewGeneralComponent;
  let fixture: ComponentFixture<ViewGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewGeneralComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
