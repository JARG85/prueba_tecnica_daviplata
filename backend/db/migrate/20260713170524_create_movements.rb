class CreateMovements < ActiveRecord::Migration[8.1]
  def change
    create_table :movements do |t|
      t.references :user, null: false, foreign_key: true
      t.decimal :amount
      t.string :movement_type
      t.string :description
      t.string :status

      t.timestamps
    end
  end
end
