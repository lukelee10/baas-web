import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToppagenavigationComponent } from './toppagenavigation.component';

describe('ToppagenavigationComponent', () => {
  let component: ToppagenavigationComponent;
  let fixture: ComponentFixture<ToppagenavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToppagenavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToppagenavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
