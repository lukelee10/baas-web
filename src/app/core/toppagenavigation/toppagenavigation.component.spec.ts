import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TopPageNavigationComponent } from './toppagenavigation.component';

describe('ToppagenavigationComponent', () => {
  let component: TopPageNavigationComponent;
  let fixture: ComponentFixture<TopPageNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopPageNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopPageNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
