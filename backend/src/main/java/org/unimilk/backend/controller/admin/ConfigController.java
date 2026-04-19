package org.unimilk.backend.controller.admin;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.unimilk.backend.dto.ConfigDto;
import org.unimilk.backend.response.UniResponse;
import org.unimilk.backend.service.SettingsService;

@Slf4j
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
        return UniResponse.success(settingsService.refreshAndGetConfig());
    }

    @PutMapping
    public UniResponse updateConfig(@RequestBody ConfigDto newConfig) {
        settingsService.updateSettings(newConfig);
        return UniResponse.success(settingsService.getConfig(), "配置保存成功~");
    }
}
