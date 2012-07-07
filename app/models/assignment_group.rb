class AssignmentGroup < ActiveRecord::Base
  has_many :assignments, :foreign_key => 'assignment_group_id'

  validates_presence_of :name
  validates_presence_of :xp
end
