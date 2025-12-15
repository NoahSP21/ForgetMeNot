package com.example.forgetMeNot.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    @RequestMapping(value = {
            "/",
            "/signin",
            "/folder/**",
            "/AppointmentManagement/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
