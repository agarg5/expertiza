require File.dirname(__FILE__) + '/../test_helper'
require 'yaml'
require 'assignment_group'


class GameDataControllerTest < ActionController::TestCase
  fixtures :assignment_groups, :assignments, :users, :participants

  # Hub tests
  test "hub is not null" do
    assignment_group = AssignmentGroup.first(:joins => :assignments, :order => "assignment_groups.created_at")

    hub = GameDataHelper::get_hub(assignment_group, 2, 2)
    assert_not_nil hub
    assert_equal 4, hub.size
  end

  # Non-Center Gate tests
  test "non-center gate is not null" do
    assignment_group = AssignmentGroup.first(:joins => :assignments, :order => "assignment_groups.created_at")

    gate = GameDataHelper::get_gate(false, assignment_group, 2, 2)

    assert_not_nil gate
    assert_equal 4, gate.size
  end

  # Center Gate tests
  test "center gate is not null" do
    assignment_group = AssignmentGroup.first(:joins => :assignments, :order => "assignment_groups.created_at")

    gate = GameDataHelper::get_gate(true, assignment_group, 2, 2)

    assert_not_nil gate
    assert_equal 4, gate.size
  end

  # Gates tests
  test "gates is not null" do
    gates = GameDataHelper::get_gates(2)

    assert_not_nil gates
    assert_equal 2, gates.size
  end

  # Buildings tests
  test "buildings is not null" do
    user = User.find_by_name("student4")
    assignment_group = AssignmentGroup.first(:joins => :assignments, :order => "assignment_groups.created_at")

    buildings = GameDataHelper::get_buildings(assignment_group.assignments, "hub#{assignment_group.id}", user.id)

    assert_not_nil buildings
    assert_equal 9, buildings.size
  end

  # Participant Progress tests
  test "participant progress is not null (no progress)" do
    user = User.find_by_name("student4")
    assignment_group = AssignmentGroup.first(:joins => :assignments, :order => "assignment_groups.created_at")

    progress = GameDataHelper::get_participant_progress(assignment_group.assignments[0].id, user.id)

    assert_not_nil progress
    assert_equal 1, progress.size
    assert_equal 0, progress["progress"]
  end

  test "participant progress is not null (with progress)" do
    user = User.find_by_name("student3")
    assignment_group = AssignmentGroup.first(:joins => :assignments, :order => "assignment_groups.created_at")

    progress = GameDataHelper::get_participant_progress(assignment_group.assignments[0].id, user.id)

    assert_not_nil progress
    assert_equal 2, progress.size
    assert_equal 2, progress["progress"]
  end

  # World tests
  test "world is not null" do
    user = User.find_by_name("student4")
    world = GameDataHelper::get_world(user.id)

    assert_not_nil world
    assert_equal 2, world.size
  end

  # Game Data tests
  test "game data is not null" do
    user = User.find_by_name("student4")
    game_data = GameDataHelper::get_game_data(user.id)

    assert_not_nil game_data
    assert_equal 2, game_data.size
  end
end
