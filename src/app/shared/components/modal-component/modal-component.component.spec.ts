import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AppModule } from 'src/app/app.module'
import { ModalComponentComponent } from './modal-component.component'

describe('ModalComponentComponent', () => {
  let component: ModalComponentComponent
  let fixture: ComponentFixture<ModalComponentComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ModalComponentComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ModalComponentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should validate if initial state is correct', () => {
    expect(component.showModal).toBeFalsy()
    expect(component.closeModal).toBeDefined()
  })

  it('should validate if close works', () => {
    jest.spyOn(component.closeModal, 'emit')
    component.close()
    expect(component.closeModal.emit).toHaveBeenCalled()
  })
})
