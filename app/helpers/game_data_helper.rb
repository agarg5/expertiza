# provides assignment game data to controller to serve as json to the game world front end
module GameDataHelper
  @@NAMED_ORDER = {1 => "first", 2 => "second", 3 => "third", 4 => "fourth", 5 => "fifth", 6 => "sixth", 7 => "seventh",
    8 => "eighth", 9 => "ninth", 10 => "tenth", 11 => "eleventh", 12 => "twelfth", 13 => "thirteenth", 14 => "fourteenth", 15 => "fifteenth",
    16 => "sixteenth", 17 => "seventeenth", 18 => "eighteenth", 19 => "nineteenth", 20 => "twentieth"}

  protected
  
  # called by game data controller to begin the process
  def self.get_game_data(user_id)
    world = get_world(user_id)
    return world
  end

  # creates all gata pertaining to the world - the rooms which contain groups of assignments,
  #   and the center which is the means of traversal between rooms
  def self.get_world(user_id)
    world = Hash.new
    world['rooms'] = Array.new
    world['center'] = Hash.new
    world['center']['title'] = "Center"
    world['center']['gates'] = Array.new
    assignment_group = AssignmentGroup.all(:joins => :assignments, :order => "assignment_groups.created_at")
    next_index = 0
    assignment_group.each do |group|
      next_index += 1
      next_group = assignment_group[next_index]
      next_group_id = nil
      if !next_group.nil?
      next_group_id = next_group.id
      end
      hub = get_hub(group, next_index, next_group_id)
      world['center']['gates'].push(get_gate(true, group, next_index, next_group_id))
      world['rooms'].push('buildings' => get_buildings(group.assignments, "hub#{group.id}", user_id))
      world['rooms'].push('hub' => hub)
      gates = Array.new
      gates.push(get_gate(false, group, next_index, next_group_id))
      world['rooms'].push('gates' => gates)
    end

    return world
  end

  # gates allow traversal to adjacent gate or back to the center
  def self.get_gate(isCenterGate, group, next_index, next_group_id)
    gate = Hash.new
    if (isCenterGate)
      targetName = 'targetName'
      name = 'name'
    else
      targetName = 'name'
      name = 'targetName'
    end
    gate[targetName] = "hub#{group.id}"
    gate[name] = "centerGate#{group.id}"
    if (!isCenterGate)
      gate['title'] = "To Center"
    else
      if next_group_id.nil?
        gate['title'] = "To the last room"
      else
        gate['title'] = "To the #{@@NAMED_ORDER[next_index]} room"
      end
    end
    if next_index == 1
      gate['isOpen'] = true
    else
      gate['isOpen'] = false
    end
    return gate
  end

  # hubs contain the gates for a specific room
  def self.get_hub(group, next_index, next_group_id)
    hub = Hash.new
    hub['openPower'] = group.xp
    hub['name'] = "hub#{group.id}"
    if next_group_id.nil?
      hub['title'] = "The last room"
      hub['gates'] = []
    else
      hub['title'] = "The #{@@NAMED_ORDER[next_index]} room"
      hub['gates'] = get_gates(next_group_id)
    end
    return hub
  end

  # gates contain info for traversal to the adjacent room
  def self.get_gates(next_index)
    gates = Array.new
    gates.push("gate#{next_index}")
    gates.push("centerGate#{next_index}")
  end

  # buildings contain info related to a specific assignment
  def self.get_buildings(assignments, hub, user_id)
    buildings = Array.new
    assignments.each do |assignment|
      building = Hash.new
      building['xp'] = assignment.xp
      building['name'] = "building#{assignment.id}"
      building['hub'] = hub
      building['title'] = assignment.name
      building['redirect'] = assignment.directory_path

      participant_progress = get_participant_progress(assignment.id, user_id)
      building['assignmentProgress'] = participant_progress['progress']
      building['earnedXP'] = participant_progress['grade']
      buildings.push(building)
    end
    return buildings
  end

  # the scoring mechanism for participants, based on grade and/or submissions
  def self.get_participant_progress(assignment_id, user_id)
    participant_progress = Hash.new
    assignment_participant = AssignmentParticipant.find(:all, {:conditions => ['user_id=? AND parent_id=?',
        user_id, assignment_id]})[0]
    participant_progress['progress'] = 0

    if (assignment_participant.nil?)
    return participant_progress
    end
    participant_progress['grade'] = assignment_participant.grade

    if !participant_progress['grade'].nil?
      participant_progress['progress'] = 2
    elsif assignment_participant.has_submissions?
      participant_progress['progress'] = 1
    end

    return participant_progress
  end

end
