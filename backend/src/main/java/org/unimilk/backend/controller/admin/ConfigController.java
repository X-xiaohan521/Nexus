package org.unimilk.backend.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.unimilk.backend.response.UniResponse;
import org.unimilk.backend.service.SettingsService;

@RestController
@RequestMapping("/api/admin/config")
public class ConfigController {
    private final SettingsService settingsService;

    @Autowired
    public ConfigController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public UniResponse getConfig() {
        return UniResponse.success(settingsService.getConfig());
    }
}
