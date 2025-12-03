package com.crypto.dashboard.repository;

import com.crypto.dashboard.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    // 新增：取得所有啟用的公告
    List<Announcement> findByIsActiveTrue();
}
