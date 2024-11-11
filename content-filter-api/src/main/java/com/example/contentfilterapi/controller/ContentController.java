package com.example.contentfilterapi.controller;

import com.example.contentfilterapi.model.Content;
import com.example.contentfilterapi.service.NsfwDetectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/content")
public class ContentController {

    @Autowired
    private NsfwDetectionService nsfwDetectionService;

    @PostMapping("/filter")
    public String filterContent(@RequestBody Content content) {
        boolean isNsfw = nsfwDetectionService.isNsfw(content);
        if (isNsfw) {
            return "Content is flagged as NSFW and will not be posted.";
        } else {
            return "Content is safe and approved for posting.";
        }
    }
}
