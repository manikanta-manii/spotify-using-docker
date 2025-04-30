class CreateAlbums < ActiveRecord::Migration[8.0]
  def change
    create_table :albums do |t|
      t.string :name, null: false
      t.date :released_date, null: false
      t.text :description
      t.references :artist, null: false, foreign_key: true  # Added null: false here

      t.timestamps
    end
  end
end
