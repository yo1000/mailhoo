package com.yo1000.mailhoo.infrastructure

import org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy
import org.hibernate.boot.model.naming.Identifier
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment

/**
 *
 * @author yo1000
 */
class TableNameStrategy(
    tableNamePrefix: String?,
) : CamelCaseToUnderscoresNamingStrategy() {
    companion object {
        lateinit var TABLE_NAME_PREFIX: String
    }

    init {
        tableNamePrefix?.let {
            TABLE_NAME_PREFIX = it
        }
    }

    override fun toPhysicalTableName(name: Identifier, context: JdbcEnvironment?): Identifier {
        return Identifier("$TABLE_NAME_PREFIX${super.toPhysicalTableName(name, context).text}", name.isQuoted)
    }
}
