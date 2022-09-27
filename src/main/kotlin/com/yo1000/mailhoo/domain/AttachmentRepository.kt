package com.yo1000.mailhoo.domain

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 *
 * @author yo1000
 */
@Repository
interface AttachmentRepository : JpaRepository<Attachment, String>
