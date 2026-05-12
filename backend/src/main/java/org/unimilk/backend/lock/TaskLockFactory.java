package org.unimilk.backend.lock;

import jakarta.annotation.Nullable;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

@Slf4j
@Component
public class TaskLockFactory {
    @Value("${app.data.directory}")
    private String dataDir;

    /**
     * Factory method for acquiring a lock.
     *
     * @param name the name of the lock to acquire
     * @return a TaskLock instance if success, otherwise null
     */
    @Nullable
    public TaskLock tryAcquire(String name) {
        try {
            Path path = Paths.get(dataDir, name + ".lock");

            FileChannel channel = FileChannel.open(
                    path,
                    StandardOpenOption.CREATE,
                    StandardOpenOption.WRITE
            );

            FileLock lock = channel.tryLock();

            if (lock == null) {
                channel.close();
                return null;
            }

            return new TaskLock(channel, lock);

        } catch (IOException e) {
            log.error("Failed to get lock named {}: cannot lock file.", name);
            return null;
        }
    }
}
