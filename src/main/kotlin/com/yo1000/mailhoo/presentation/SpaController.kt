package com.yo1000.mailhoo.presentation

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class SpaController {
    @GetMapping("/**/{path:[^.]*}")
    fun get(): String = "forward:/index.html"
}
