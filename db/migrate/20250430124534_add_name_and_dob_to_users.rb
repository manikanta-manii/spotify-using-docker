# db/migrate/[timestamp]_add_name_and_dob_to_users.rb
class AddNameAndDobToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :name, :string, null: false
    add_column :users, :dob, :date
  end
end