class CreatePosts < ActiveRecord::Migration
  def self.up
    create_table :posts do |t|
      t.string :title
      t.text :body
      t.boolean :published

      t.timestamps
    end

    Post.reset_column_information

    Post.create(:title => "Hello, world")
  end

  def self.down
    drop_table :posts
  end
end
