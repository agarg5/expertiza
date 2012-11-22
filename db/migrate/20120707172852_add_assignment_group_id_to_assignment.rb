class AddAssignmentGroupIdToAssignment < ActiveRecord::Migration
  def self.up
    add_column :assignments, :assignment_group_id, :integer

    add_index "assignments", ["assignment_group_id"], :name => "fk_assignments_group_id"

    execute "alter table assignments
             add constraint fk_assignments_group_id
             foreign key (assignment_group_id) references assignment_groups(id)"

  end

  def self.down
    remove_column :assignments, :assignment_group_id
  end
end
