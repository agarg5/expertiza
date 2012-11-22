class CreateAssignmentGroups < ActiveRecord::Migration
  def self.up
    create_table :assignment_groups do |t|
      t.string :name
      t.integer :xp

      t.timestamps
    end

  end

  def self.down
    drop_table :assignment_groups
  end
end