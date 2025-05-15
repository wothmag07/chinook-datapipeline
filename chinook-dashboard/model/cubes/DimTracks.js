cube(`DimTracks`, {
  sql: `SELECT * FROM chinook_db_marts.dim_tracks`,
  
  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started  
  },
  
  measures: {
    count: {
      type: `count`,
      description: "Total number of tracks.",
      drillMembers: [trackId, trackName, albumTitle, artistName]
    },
    summedUnitsSold: {
      title: "Summed Units Sold (Group)",
      description: "Total units sold for the selected group of tracks.",
      sql: `units_sold`,
      type: `sum`
    },
    summedRevenue: {
      title: "Summed Revenue (Group)",
      description: "Total revenue from the selected group of tracks.",
      sql: `revenue`,
      type: `sum`,
      format: `currency`
    },
    avgOfTrackASP: { // Average of individual track's average sale price
      title: "Avg of Track ASP's",
      description: "Average of individual track average sale prices.",
      sql: `avg_sale_price`,
      type: `avg`,
      format: `currency`
    },
    groupAverageSalePrice: {
      title: "Group Avg Sale Price",
      description: "Overall average sale price for the selected group of tracks (Summed Revenue / Summed Units).",
      sql: `${CUBE.summedRevenue} / NULLIF(${CUBE.summedUnitsSold}, 0)`,
      type: `number`,
      format: `currency`
    }
  },

  dimensions: {
    trackId: {
      sql: `track_id`,
      type: `number`,
      primaryKey: true
    },
    trackName: {
      sql: `track_name`,
      type: `string`
    },
    listPrice: {
      sql: `list_price`,
      type: `number`,
      format: `currency`
    },
    durationMs: {
      sql: `duration_ms`,
      type: `number`
    },
    fileSize: {
      sql: `file_size`,
      type: `number`
    },
    albumId: {
      sql: `album_id`,
      type: `number`
    },
    albumTitle: {
      sql: `album_title`,
      type: `string`
    },
    artistId: {
      sql: `artist_id`,
      type: `number`
    },
    artistName: {
      sql: `artist_name`,
      type: `string`
    },
    genreId: {
      sql: `genre_id`,
      type: `number`
    },
    genreName: {
      sql: `genre_name`,
      type: `string`
    },
    mediaTypeId: {
      sql: `media_type_id`,
      type: `number`
    },
    mediaTypeName: {
      sql: `media_type_name`,
      type: `string`
    },
    firstSoldDate: {
      sql: `first_sold_date`,
      type: `time`
    },
    lastSoldDate: {
      sql: `last_sold_date`,
      type: `time`
    }
  },

  joins: {
    DimAlbum: { // Changed from Albums to DimAlbum for consistency
      sql: `${CUBE}.album_id = ${DimAlbum}.album_id`,
      relationship: `belongsTo`
    },
    // Artists join removed as artist_name is denormalized in this cube
    DimGenres: { // Changed from Genres to DimGenres
      sql: `${CUBE}.genre_id = ${DimGenres}.genre_id`,
      relationship: `belongsTo`
    },
    DimMediaTypes: { // Changed from MediaTypes to DimMediaTypes
      sql: `${CUBE}.media_type_id = ${DimMediaTypes}.media_type_id`,
      relationship: `belongsTo`
    }
  }
});
