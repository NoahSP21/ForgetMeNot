package com.example.forgetMeNot.controller;

import com.example.forgetMeNot.model.Appointment;
import com.example.forgetMeNot.security.FirebaseTokenUtil;
import com.example.forgetMeNot.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService service;

    @GetMapping("/sections")
    public List<String> getSections(@RequestHeader("Authorization") String token) throws Exception {
        String uid = FirebaseTokenUtil.verify(token);
        return service.getAllSections(uid);
    }

    @GetMapping
    public List<Appointment> getAll(@RequestHeader("Authorization") String token) throws Exception {
        String uid = FirebaseTokenUtil.verify(token);
        return service.getAll(uid);
    }

    @GetMapping("/status/{confirmed}")
    public List<Appointment> getByStatus(
            @RequestHeader("Authorization") String token,
            @PathVariable boolean confirmed) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        return service.getByConfirmed(uid, confirmed);
    }

    @PostMapping
    public Appointment create(
            @RequestHeader("Authorization") String token,
            @RequestBody Appointment appointment) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        return service.create(uid, appointment);
    }

    @PutMapping("/{id}")
    public void update(
            @RequestHeader("Authorization") String token,
            @PathVariable String id,
            @RequestBody Appointment appointment) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        appointment.setId(id);
        service.update(uid, appointment);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @RequestHeader("Authorization") String token,
            @PathVariable String id) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        service.delete(uid, id);
    }
}
