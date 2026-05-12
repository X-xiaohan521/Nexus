package org.unimilk.backend.lock;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;

@Slf4j
public class TaskLock implements AutoCloseable {

    private final FileChannel channel;
    private final FileLock lock;

    private boolean released = false;

    protected TaskLock(FileChannel channel, FileLock lock) {
        this.channel = channel;
        this.lock = lock;
    }

    /**
     * Release the lock explicitly.
     */
    public void release() {

        if (released) {
            return;
        }

        try {
            lock.release();
        } catch (IOException e) {
            log.error("Failed to release lock: cannot access lock file.");
        } finally {

            try {
                channel.close();
            } catch (IOException ignored) {}

            released = true;
        }
    }

    /**
     * Release lock with try-with-resources.
     */
    @Override
    public void close() {
        release();
    }
}