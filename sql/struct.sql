-- Address Table
-- ==============
-- StreetName 
-- ExteriorNumber 
-- Neighborhood
-- PostalCode

CREATE TABLE Address (
    id              int primary key,
    StreetName      varchar(50),
    ExteriorNumber  varchar(6),
    Neighborhood    varchar(50),
    PostalCode      varchar(5)
);

-- Member Table
-- ==============
-- FirstName
-- LastName
-- MiddleName
-- DateOfBirth
-- Gender
-- MaritalStatus
-- Occupation 
-- PhoneNumber
-- MobileNumber
-- Email
-- Whatsapp
-- SocialMedia
-- ContactNotes
-- AddressID

CREATE TABLE Member (
    id              int primary key,
    FirstName       varchar(45),
    LastName        varchar(45),
    MiddleName      varchar(45),
    profile_url     varchar(150),
    active          boolean,
    DateOfBirth     DATE,
    Gender          CHAR,
    MaritalStatus   CHAR,
    Occupation      varchar(40),
    PhoneNumber     varchar(25),
    MobileNumber    varchar(22),
    Email           varchar(60),
    Whatsapp        varchar(25),
    SocialMedia     varchar(40),
    ContactNotes    varchar(55),
    AddressID       int,
    CONSTRAINT fk_address FOREIGN KEY (AddressID) REFERENCES Address(id)
);


