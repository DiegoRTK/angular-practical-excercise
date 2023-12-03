import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LoadingComponentComponent } from './loading-component.component'
import { AppModule } from 'src/app/app.module'

describe('LoadingComponentComponent', () => {
  let component: LoadingComponentComponent
  let fixture: ComponentFixture<LoadingComponentComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ LoadingComponentComponent ]
    })
    .compileComponents()

    fixture = TestBed.createComponent(LoadingComponentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should validate if initial state is correct', () => {
    expect(component.message).toBe('')
  })
})
