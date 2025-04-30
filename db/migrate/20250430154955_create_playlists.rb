class CreatePlaylists < ActiveRecord::Migration[8.0]
  def change
    create_table :playlists do |t|
      t.string :name, null: false
      t.string :description
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    # Add a unique index for name scoped to user_id
    add_index :playlists, [:name, :user_id], unique: true
  end
end
