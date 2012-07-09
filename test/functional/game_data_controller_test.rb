require File.dirname(__FILE__) + '/../test_helper'
require 'yaml'
require 'assignment_group'


class GameDataControllerTest < ActionController::TestCase
  fixtures :assignment_groups, :assignments
  test "the truth" do
    assert true
  end
end
