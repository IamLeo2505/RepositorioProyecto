ALTER TABLE dbo.producto REBUILD WITH (DATA_COMPRESSION = PAGE);
exec sp_spaceused producto;