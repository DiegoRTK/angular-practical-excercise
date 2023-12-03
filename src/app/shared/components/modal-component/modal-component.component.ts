import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.css']
})
export class ModalComponentComponent implements OnInit {

  @Input() showModal: boolean = false
  @Output() closeModal = new EventEmitter()

  ngOnInit(): void {
  }

  close(): void {
    this.closeModal.emit()
  }

}