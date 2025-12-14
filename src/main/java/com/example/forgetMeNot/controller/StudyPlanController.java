package com.example.forgetMeNot.controller;

import com.example.forgetMeNot.model.StudyPlan;
import com.example.forgetMeNot.security.FirebaseTokenUtil;
import com.example.forgetMeNot.service.StudyPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/study")
public class StudyPlanController {

    @Autowired
    private StudyPlanService service;

    @GetMapping
    public List<StudyPlan> getAll(@RequestHeader("Authorization") String token) throws Exception {
        String uid = FirebaseTokenUtil.verify(token);
        return service.getPlans(uid);
    }

    @GetMapping("/{id}")
    public StudyPlan getOne(
            @RequestHeader("Authorization") String token,
            @PathVariable String id) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        return service.getPlan(uid, id);
    }

    @PostMapping
    public StudyPlan create(
            @RequestHeader("Authorization") String token,
            @RequestBody StudyPlan plan) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        return service.create(uid, plan);
    }

    @PutMapping("/{id}")
    public void update(
            @RequestHeader("Authorization") String token,
            @PathVariable String id,
            @RequestBody Map<String, Object> data) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        service.update(uid, id, data);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @RequestHeader("Authorization") String token,
            @PathVariable String id) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        service.delete(uid, id);
    }
}
