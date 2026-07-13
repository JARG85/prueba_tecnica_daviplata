class CreateUsers < ActiveRecord::Migration[8.1]
   def change
    create_table :users do |t|
      t.string :name
      t.string :phone
      t.string :password_digest
      t.string :status
      t.decimal :balance

      t.timestamps
    end
  end
end
