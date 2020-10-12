/*
 * Copyright © 2018 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ford.labs.retroquest.thought;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThoughtRepository extends JpaRepository<Thought, Long> {
    List<Thought> findAllByTeamId(String teamId);

    List<Thought> findAllByTeamIdAndBoardIdIsNull(String teamId);

    List<Thought> findAllByTeamIdAndBoardIdIsNullOrderByTopic(String teamId);

    void deleteAllByTeamId(String teamId);

    void deleteThoughtByTeamIdAndId(String teamId, Long id);

    @Query("SELECT MAX(t.id) FROM Thought t Where t.teamId = :teamId")
    Optional<Long> getMaxIdByTeamId(String teamId);
}
