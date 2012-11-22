class AddXpToAssignment < ActiveRecord::Migration
  def self.up
    add_column :assignments, :xp, :integer
  end

  def self.down
    remove_column :assignments, :xp
  end
end
