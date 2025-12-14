package com.example.forgetMeNot.service;

import com.example.forgetMeNot.model.GroceryList;
import com.example.forgetMeNot.repository.GroceryListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroceryListService {

    @Autowired
    private GroceryListRepository repo;

    public List<GroceryList> getLists(String uid) throws Exception {
        return repo.getAll(uid);
    }

    public GroceryList getList(String uid, String id) throws Exception {
        return repo.getOne(uid, id);
    }

    public GroceryList create(String uid, GroceryList list) throws Exception {
        return repo.create(uid, list);
    }

    public void update(String uid, GroceryList list) throws Exception {
        repo.update(uid, list);
    }

    public void delete(String uid, String id) throws Exception {
        repo.delete(uid, id);
    }
}
