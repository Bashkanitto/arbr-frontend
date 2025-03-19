import { makeAutoObservable } from 'mobx'

class HelpDeskStore {
  isOpen = false

  constructor() {
    makeAutoObservable(this)
  }

  open() {
    this.isOpen = true
  }

  close() {
    this.isOpen = false
  }
}

export const helpDeskStore = new HelpDeskStore()
