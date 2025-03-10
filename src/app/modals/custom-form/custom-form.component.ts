import { CommonModule, PlatformLocation } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IconsModule } from '../../icons/icons.module';
import { FormsModule } from '@angular/forms';

interface CustomField {
  field: string,
  value: string,
  error: string,
  type: string,
  options?: { value: string }[]
}

@Component({
  selector: 'app-custom-form',
  imports: [IconsModule, CommonModule, FormsModule],
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.css']
})
export class CustomFormComponent implements OnInit {
  public activeModal = inject(NgbActiveModal)
  private location = inject(PlatformLocation)

  @Input() form: CustomField[][]
  tempForm: CustomField[][]
  create: boolean
  update: boolean
  rowIndex: number
  columnIndex: number
  options: { value: string }[]
  step: string
  dirty: boolean
  field: CustomField
  fieldErr: boolean
  option: string
  optionsErr: boolean

  constructor() {
    this.location.onPopState(() => this.activeModal.close());
    this.form = []
    this.tempForm = []
    this.create = true
    this.update = false
    this.rowIndex = 0
    this.columnIndex = 0
    this.options = []
    this.step = 'edit'
    this.field = {field: '', value: '', type: '', error: ''}
    this.fieldErr = false
    this.dirty = false
    this.option = ''
    this.optionsErr = false
  }

  ngOnInit(): void {
    if (!this.form.length) {
      this.tempForm.push([{ field: "Name", value: "", error: "", type: "text" }, { field: "Breed", value: "", error: "", type: "select", options: [{ value: "Mixed" }, { value: "Bulldog" },{ value: "Boxer" }] }, { field: "Size", value: "", error: "", type: "select", options: [{ value: "Small" }, { value: "Medium" }, {value: "Large"}, {value: 'Xlarge'}] }])
      this.tempForm.push([{ field: "Age", value: "", error: "", type: "select", options:[{value: 'Puppy'},{value: 'Adult'}, {value: 'Senior'}] }, { field: "Gender", value: "", error: "", type: "select", options:[{value:"Male"},{value: "Female"}] }])
      this.tempForm.push([{ field: "Spayed/Neutered", value: "true", error: "", type: "checkbox" }, { field: "Medication", value: "", error: "", type: "textarea" }])
      this.tempForm.push([{ field: "Breakfast", value: "true", error: "", type: "checkbox" }, { field: "Lunch", value: "true", error: "", type: "checkbox" }, { field: "Dinner", value: "true", error: "", type: "checkbox" }])
      this.tempForm.push([{ field: "Food amount", value: "", error: "", type: "text" }])
    } else {
      this.tempForm = this.form
    }
  }

  removeRow(i: number) {
    this.tempForm.splice(i, 1)
  }

  removeField(i: number, j: number) {
    this.tempForm[i].splice(j, 1)
  }

  addRow() {
    this.tempForm.push([])
  }

  addField(i: number) {
    this.step = 'pick'
    this.field.field = ''
    this.options = []
    this.rowIndex = i
  }

  editField(i: number, j: number) {
    this.step = 'pick'
    this.field = this.tempForm[i][j]
    if (this.field.type === 'select') {
      this.options = this.field.options || []
    }
    this.rowIndex = i
    this.columnIndex = j
    this.update = true
  }

  pickInputType(type: string) {
    if (this.field.field === '') {
      this.fieldErr = true
      return
    }
    this.field.type = type
    if (type === 'select') {
      this.step = 'select'
      return
    } else if (this.update) {
      this.tempForm[this.rowIndex][this.columnIndex] = this.field
      this.update = false
    } else {
      this.tempForm[this.rowIndex].push(this.field)
    }
    this.step = 'edit'
  }

  resetFieldErr() {
    this.fieldErr = false
  }

  previewForm() {
    if(this.step === 'edit') {
      this.step = 'preview'
    } else {
      this.step = 'edit'
    }
  }

  addOption() {
    if (this.option !== '')
      this.options.push({ value: this.option })
    this.option = ''
  }

  removeOption(i: number) {
    this.options.splice(i, 1)
  }

  resetOptionErr() {
    this.optionsErr = false
  }

  continue() {
    if(this.options.length) {
      this.field.options = this.options
      if (this.update) {
        this.tempForm[this.rowIndex][this.columnIndex] = this.field
        this.update = false
      } else {
        this.tempForm[this.rowIndex].push(this.field)
      }
      this.step = 'edit'
    } else {
      this.optionsErr = true
    }
  }

  createForm() {
    for (let i = 0; i < this.tempForm.length; i++) {
      let row = this.tempForm[i]
      for (let j = 0; j < row.length; j++) {
        let col = row[j]
        if (col.field === "Field" || col.field === "") {
          row.splice(j, 1)
          j--
        }
      }
      if (!row.length) {
        this.tempForm.splice(i, 1)
        i--
      }
    }
    this.activeModal.close(this.tempForm)
  }

  deleteForm() {
    this.activeModal.close([])
  }

}
