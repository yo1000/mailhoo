export default class ViewState {
  constructor({
    initializedState,
    fromDomainsState,
    toDomainsState,
    ccDomainsState,
    bccDomainsState,
    pagedMessagesState,
    messageDetailsState,
    viewConditionState
  }) {
    const [initialized, setInitialized] = initializedState
    this.initialized = initialized
    this.setInitialized = setInitialized

    const [fromDomains, setFromDomains] = fromDomainsState
    this.fromDomains = fromDomains
    this.setFromDomains = setFromDomains

    const [toDomains, setToDomains] = toDomainsState
    this.toDomains = toDomains
    this.setToDomains = setToDomains

    const [ccDomains, setCcDomains] = ccDomainsState
    this.ccDomains = ccDomains
    this.setCcDomains = setCcDomains

    const [bccDomains, setBccDomains] = bccDomainsState
    this.bccDomains = bccDomains
    this.setBccDomains = setBccDomains

    const [pagedMessages, setPagedMessages] = pagedMessagesState
    this.pagedMessages = pagedMessages
    this.setPagedMessages = setPagedMessages

    const [messageDetails, setMessageDetails] = messageDetailsState
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
    const [viewCondition, setViewCondition] = viewConditionState
    this.viewCondition = viewCondition
    this.setViewCondition = setViewCondition
  }

  get API_BASE_URL() {
    return process.env.API_BASE_URL
  }

  get NUMBERING_PAGINATOR() {
    return process.env.NUMBERING_PAGINATOR
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

  updateMessages(n, dir, apiBaseUrl, viewCondition, extraCallback) {
    const pageQuery = this.NUMBERING_PAGINATOR ? (
      // Paginate by page number
      !n && n !== 0 ? '' : `page=${n}`
    ) : (
      // Paginate by sequence
      n && dir === 'next' ? `nextSeq=${n}` :
      n && dir === 'prev' ? `prevSeq=${n}` :
      'prevSeq=max'
    )

    this.lockMutex()

    fetch(`${apiBaseUrl}&${pageQuery}`)
      .then(resp => resp.json())
      .then(messages => {
        this.setViewCondition(viewCondition)
        this.setPagedMessages(messages)
        this.setMessageDetails(null)

        this.updatePaginatorStyle(messages)
        this.unlockMutex()
        if (extraCallback) extraCallback()
      })
  }

  lockMutex() {
    document.querySelectorAll('.mutex').forEach(elm => {
      elm.classList.add('lock')
    })
  }

  unlockMutex() {
    document.querySelectorAll('.mutex').forEach(elm => {
      elm.classList.remove('lock')
    })
  }

  activateDomainFilterStyle(event) {
    this.deactivateDomainFilterStyle()
    event.target.classList.add('current')
  }

  deactivateDomainFilterStyle() {
    document.querySelectorAll('.current').forEach(elm => {
      elm.classList.remove('current')
    })
  }

  updatePaginatorStyle(messages) {
    if (messages && messages.first) {
      document.querySelectorAll('.next').forEach(elm => {
        elm.setAttribute("disabled", "disabled")
      })
    } else {
      document.querySelectorAll('.next').forEach(elm => {
        elm.removeAttribute("disabled")
      })
    }

    if (messages && messages.last) {
      document.querySelectorAll('.prev').forEach(elm => {
        elm.setAttribute("disabled", "disabled")
      })
    } else {
      document.querySelectorAll('.prev').forEach(elm => {
        elm.removeAttribute("disabled")
      })
    }
  }

  renderWithUpdateDomains({n, dir, filter}) {
    this.updateFromDomains()
    this.updateToDomains()
    this.updateCcDomains()
    this.updateBccDomains()

    this.render({n: n, dir: dir, filter: filter})
  }

  render({n, dir, filter}) {
    const pageNumber = (n || n === 0) ? n :
      (this.viewCondition && this.viewCondition.number) ? this.viewCondition.number :
      !this.NUMBERING_PAGINATOR ? 'max' : 0

    const direction = dir ? dir :
      (this.viewCondition && this.viewCondition.dir) ? this.viewCondition.dir :
      !this.NUMBERING_PAGINATOR ? 'prev' : null

    const searchQuery = filter ? filter.q : this.viewCondition && this.viewCondition.listBySearchQuery
    const fromDomain = filter ? filter.from : this.viewCondition && this.viewCondition.listByFromDomain
    const toDomain = filter ? filter.to : this.viewCondition && this.viewCondition.listByToDomain
    const ccDomain = filter ? filter.cc : this.viewCondition && this.viewCondition.listByCcDomain
    const bccDomain = filter ? filter.bcc : this.viewCondition && this.viewCondition.listByBccDomain

    if (searchQuery) {
      this.updateMessages(pageNumber, direction,
        `${this.API_BASE_URL}/messages/search?q=${searchQuery.q}&f=${searchQuery.f}`,
        { listBySearchQuery: searchQuery, number: pageNumber, dir: direction },
        () => { this.deactivateDomainFilterStyle() }
      )
    } else if (fromDomain) {
      this.updateMessages(pageNumber, direction,
        `${this.API_BASE_URL}/messages?fromDomain=${fromDomain}`,
        { listByFromDomain: fromDomain, number: pageNumber, dir: direction },
      )
    } else if (toDomain) {
      this.updateMessages(pageNumber, direction,
        `${this.API_BASE_URL}/messages?toDomain=${toDomain}`,
        { listByToDomain: toDomain, number: pageNumber, dir: direction },
      )
    } else if (ccDomain) {
      this.updateMessages(pageNumber, direction,
        `${this.API_BASE_URL}/messages?ccDomain=${ccDomain}`,
        { listByCcDomain: ccDomain, number: pageNumber, dir: direction },
      )
    } else if (bccDomain) {
      this.updateMessages(pageNumber, direction,
        `${this.API_BASE_URL}/messages?bccDomain=${bccDomain}`,
        { listByBccDomain: bccDomain, number: pageNumber, dir: direction },
      )
    } else {
      this.updateMessages(pageNumber, direction,
        `${this.API_BASE_URL}/messages?all`,
        { list: 'all', number: n, dir: dir },
      )
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
