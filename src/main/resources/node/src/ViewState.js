import {useState} from "react";

export default class ViewState {
  constructor() {
    const [initialized, setInitialized] = useState(false)
    this.initialized = initialized
    this.setInitialized = setInitialized

    const [fromDomains, setFromDomains] = useState()
    this.fromDomains = fromDomains
    this.setFromDomains = setFromDomains

    const [toDomains, setToDomains] = useState()
    this.toDomains = toDomains
    this.setToDomains = setToDomains

    const [ccDomains, setCcDomains] = useState()
    this.ccDomains = ccDomains
    this.setCcDomains = setCcDomains

    const [bccDomains, setBccDomains] = useState()
    this.bccDomains = bccDomains
    this.setBccDomains = setBccDomains

    const [pagedMessages, setPagedMessages] = useState()
    this.pagedMessages = pagedMessages
    this.setPagedMessages = setPagedMessages

    const [messageDetails, setMessageDetails] = useState()
    this.messageDetails = messageDetails
    this.setMessageDetails = setMessageDetails

    /**
     * { list: 'all' }
     * { listBySearchQuery: ... }
     * { listByFromDomain: ... }
     * { listByToDomain: ... }
     * { listByCcDomain: ... }
     * { listByBccDomain: ... }
     */
    const [viewCondition, setViewCondition] = useState()
    this.viewCondition = viewCondition
    this.setViewCondition = setViewCondition
  }

  get API_BASE_URL() {
    return process.env.API_BASE_URL
  }

  updateFromDomains() {
    fetch(`${this.API_BASE_URL}/domains/from`)
      .then(resp => resp.json())
      .then(domains => this.setFromDomains(domains))
  }

  updateToDomains() {
    fetch(`${this.API_BASE_URL}/domains/to`)
      .then(resp => resp.json())
      .then(domains => this.setToDomains(domains))
  }

  updateCcDomains() {
    fetch(`${this.API_BASE_URL}/domains/cc`)
      .then(resp => resp.json())
      .then(domains => this.setCcDomains(domains))
  }

  updateBccDomains() {
    fetch(`${this.API_BASE_URL}/domains/bcc`)
      .then(resp => resp.json())
      .then(domains => this.setBccDomains(domains))
  }

  updateMessages(page) {
    fetch(`${this.API_BASE_URL}/messages${page ? `?page=${page}` : ''}`)
      .then(resp => resp.json())
      .then(messages => {
        this.setViewCondition({ list: 'all' })
        this.setPagedMessages(messages)
        this.setMessageDetails(null)
      })
  }

  updateMessagesByFromDomain(domainName, page) {
    fetch(`${this.API_BASE_URL}/messages?fromDomain=${domainName}${page ? `&page=${page}` : ''}`)
      .then(resp => resp.json())
      .then(messages => {
        this.setViewCondition({ listByFromDomain: domainName })
        this.setPagedMessages(messages)
        this.setMessageDetails(null)
      })
  }

  updateMessagesByToDomain(domainName, page) {
    fetch(`${this.API_BASE_URL}/messages?toDomain=${domainName}${page ? `&page=${page}` : ''}`)
      .then(resp => resp.json())
      .then(messages => {
        this.setViewCondition({ listByToDomain: domainName })
        this.setPagedMessages(messages)
        this.setMessageDetails(null)
      })
  }

  updateMessagesByCcDomain(domainName, page) {
    fetch(`${this.API_BASE_URL}/messages?ccDomain=${domainName}${page ? `&page=${page}` : ''}`)
      .then(resp => resp.json())
      .then(messages => {
        this.setViewCondition({ listByCcDomain: domainName })
        this.setPagedMessages(messages)
        this.setMessageDetails(null)
      })
  }

  updateMessagesByBccDomain(domainName, page) {
    fetch(`${this.API_BASE_URL}/messages?bccDomain=${domainName}${page ? `&page=${page}` : ''}`)
      .then(resp => resp.json())
      .then(messages => {
        this.setViewCondition({ listByBccDomain: domainName })
        this.setPagedMessages(messages)
        this.setMessageDetails(null)
      })
  }

  updateMessagesBySearchQuery(searchQuery, page) {
    fetch(`${this.API_BASE_URL}/messages/search?q=${searchQuery}${page ? `&page=${page}` : ''}`)
      .then(resp => resp.json())
      .then(messages => {
        this.setViewCondition({ listBySearchQuery: searchQuery })
        this.setPagedMessages(messages)
        this.setMessageDetails(null)
        this.deactivateDomainFilterStyle()
      })
  }

  activateDomainFilterStyle(event) {
    this.deactivateDomainFilterStyle()
    event.target.classList.add('active')
  }

  deactivateDomainFilterStyle() {
    document.querySelectorAll('.active').forEach(elm => {
      elm.classList.remove('active')
    })
  }

  reload(page) {
    this.updateFromDomains()
    this.updateToDomains()
    this.updateCcDomains()
    this.updateBccDomains()

    const reloadPage = page ? page :
      this.pagedMessages ? this.pagedMessages.number :
      0

    if (this.viewCondition && this.viewCondition.listBySearchQuery) {
      this.updateMessagesBySearchQuery(this.viewCondition.listBySearchQuery, reloadPage)
    } else if (this.viewCondition && this.viewCondition.listByFromDomain) {
      this.updateMessagesByFromDomain(this.viewCondition.listByFromDomain, reloadPage)
    } else if (this.viewCondition && this.viewCondition.listByToDomain) {
      this.updateMessagesByToDomain(this.viewCondition.listByToDomain, reloadPage)
    } else if (this.viewCondition && this.viewCondition.listByCcDomain) {
      this.updateMessagesByCcDomain(this.viewCondition.listByCcDomain, reloadPage)
    } else if (this.viewCondition && this.viewCondition.listByBccDomain) {
      this.updateMessagesByBccDomain(this.viewCondition.listByBccDomain, reloadPage)
    } else {
      this.updateMessages(reloadPage)
    }
  }

  isDetailsView() {
    return this.messageDetails
  }

  isListView() {
    return this.viewCondition && (
      this.viewCondition.list ||
      this.viewCondition.listBySearchQuery ||
      this.viewCondition.listByFromDomain ||
      this.viewCondition.listByToDomain ||
      this.viewCondition.listByCcDomain ||
      this.viewCondition.listByBccDomain
    )
  }

  chooseMessage(message) {
    this.setMessageDetails(message)
  }
}
