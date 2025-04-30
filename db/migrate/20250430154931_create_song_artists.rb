class CreateSongArtists < ActiveRecord::Migration[8.0]
  def change
    create_table :song_artists do |t|
      t.references :song, null: false, foreign_key: true
      t.references :artist, null: false, foreign_key: true

      t.timestamps
    end

    # Add a unique index to prevent duplicate associations
    add_index :song_artists, [:song_id, :artist_id], unique: true
  end
end
