class CreateArtists < ActiveRecord::Migration[8.0]
  def change
    create_table :artists do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.text :bio

      t.timestamps
    end
  end
end
