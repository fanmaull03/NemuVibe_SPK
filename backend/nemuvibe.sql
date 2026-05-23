-- Tabel untuk menyimpan data cafe dan nilai mentahnya
CREATE TABLE cafes (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100),
    c1_digital INT,
    c2_harga INT,
    c3_suasana INT,
    c4_tenang INT,
    c5_hiburan INT,
    c6_rasa INT
);


INSERT INTO cafes (nama, c1_digital, c2_harga, c3_suasana, c4_tenang, c5_hiburan, c6_rasa) VALUES
('Cold n Brew', 5, 2, 5, 5, 2, 5),
('At Cafe Campus', 5, 4, 3, 3, 2, 4),
('Els Koffie', 5, 2, 5, 4, 3, 5),
('Warkop Sumringah', 4, 5, 3, 2, 4, 3),
('Warkop Sarinah', 2, 5, 2, 2, 3, 3),
('Warkop Soeharto', 3, 5, 4, 2, 4, 3),
('Kedai Semoga Bahagia', 3, 4, 5, 4, 2, 4),
('The Soeds Coffee', 5, 3, 5, 3, 4, 4),
('Vato Coffee', 4, 3, 5, 4, 3, 5);