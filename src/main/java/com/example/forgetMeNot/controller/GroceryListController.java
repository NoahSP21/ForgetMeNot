package com.example.forgetMeNot.controller;

import com.example.forgetMeNot.model.GroceryList;
import com.example.forgetMeNot.security.FirebaseTokenUtil;
import com.example.forgetMeNot.service.GroceryListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grocery")
public class GroceryListController {

    @Autowired
    private GroceryListService service;

    @GetMapping
    public List<GroceryList> getAll(@RequestHeader("Authorization") String token) throws Exception {
        String uid = FirebaseTokenUtil.verify(token);
        return service.getLists(uid);
    }

    @GetMapping("/{id}")
    public GroceryList getOne(
            @RequestHeader("Authorization") String token,
            @PathVariable String id) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        return service.getList(uid, id);
    }

    @PostMapping
    public GroceryList create(
            @RequestHeader("Authorization") String token,
            @RequestBody GroceryList list) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        return service.create(uid, list);
    }

    @PutMapping("/{id}")
    public void update(
            @RequestHeader("Authorization") String token,
            @PathVariable String id,
            @RequestBody GroceryList list) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        list.setId(id);
        service.update(uid, list);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @RequestHeader("Authorization") String token,
            @PathVariable String id) throws Exception {

        String uid = FirebaseTokenUtil.verify(token);
        service.delete(uid, id);
    }
}
