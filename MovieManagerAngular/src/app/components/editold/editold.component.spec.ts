import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditoldComponent } from './editold.component';

describe('EditoldComponent', () => {
  let component: EditoldComponent;
  let fixture: ComponentFixture<EditoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
