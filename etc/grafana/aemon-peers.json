{
  "annotations": {
    "list": [
      {
        "builtIn": 1,
        "datasource": {
          "type": "grafana",
          "uid": "-- Grafana --"
        },
        "enable": true,
        "hide": true,
        "iconColor": "rgba(0, 211, 255, 1)",
        "name": "Annotations & Alerts",
        "target": {
          "limit": 100,
          "matchAny": false,
          "tags": [],
          "type": "dashboard"
        },
        "type": "dashboard"
      }
    ]
  },
  "editable": true,
  "fiscalYearStartMonth": 0,
  "graphTooltip": 0,
  "id": 3,
  "links": [],
  "liveNow": false,
  "panels": [
    {
      "datasource": {
        "type": "prometheus",
        "uid": "f1TL-3BVz"
      },
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "hideFrom": {
              "legend": false,
              "tooltip": false,
              "viz": false
            }
          },
          "mappings": []
        },
        "overrides": []
      },
      "gridPos": {
        "h": 7,
        "w": 6,
        "x": 0,
        "y": 0
      },
      "id": 6,
      "options": {
        "legend": {
          "displayMode": "table",
          "placement": "right",
          "showLegend": true,
          "values": [
            "percent"
          ]
        },
        "pieType": "pie",
        "reduceOptions": {
          "calcs": [
            "lastNotNull"
          ],
          "fields": "",
          "values": true
        },
        "tooltip": {
          "mode": "single",
          "sort": "none"
        }
      },
      "targets": [
        {
          "datasource": {
            "type": "prometheus",
            "uid": "f1TL-3BVz"
          },
          "editorMode": "code",
          "exemplar": false,
          "expr": "topk(7, count(aemon_peer_info{networkId=\"$networkId\"}) by (version))",
          "format": "table",
          "instant": true,
          "legendFormat": "__auto",
          "range": false,
          "refId": "A"
        }
      ],
      "title": "Top Versions",
      "type": "piechart"
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "f1TL-3BVz"
      },
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "hideFrom": {
              "legend": false,
              "tooltip": false,
              "viz": false
            }
          },
          "mappings": []
        },
        "overrides": [
          {
            "__systemRef": "hideSeriesFrom",
            "matcher": {
              "id": "byNames",
              "options": {
                "mode": "exclude",
                "names": [
                  "Value"
                ],
                "prefix": "All except:",
                "readOnly": true
              }
            },
            "properties": [
              {
                "id": "custom.hideFrom",
                "value": {
                  "legend": false,
                  "tooltip": false,
                  "viz": true
                }
              }
            ]
          }
        ]
      },
      "gridPos": {
        "h": 7,
        "w": 6,
        "x": 6,
        "y": 0
      },
      "id": 10,
      "options": {
        "legend": {
          "displayMode": "table",
          "placement": "right",
          "showLegend": true,
          "values": [
            "percent"
          ]
        },
        "pieType": "pie",
        "reduceOptions": {
          "calcs": [
            "lastNotNull"
          ],
          "fields": "",
          "values": true
        },
        "tooltip": {
          "mode": "single",
          "sort": "none"
        }
      },
      "targets": [
        {
          "datasource": {
            "type": "prometheus",
            "uid": "f1TL-3BVz"
          },
          "editorMode": "code",
          "exemplar": false,
          "expr": "topk(7, count(aemon_peer_info{networkId=\"$networkId\"}) by (revision))",
          "format": "table",
          "instant": true,
          "legendFormat": "__auto",
          "range": false,
          "refId": "A"
        }
      ],
      "title": "Top Revisions",
      "type": "piechart"
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "f1TL-3BVz"
      },
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "hideFrom": {
              "legend": false,
              "tooltip": false,
              "viz": false
            }
          },
          "mappings": []
        },
        "overrides": []
      },
      "gridPos": {
        "h": 7,
        "w": 6,
        "x": 12,
        "y": 0
      },
      "id": 12,
      "options": {
        "legend": {
          "displayMode": "list",
          "placement": "bottom",
          "showLegend": true
        },
        "pieType": "pie",
        "reduceOptions": {
          "calcs": [
            "lastNotNull"
          ],
          "fields": "",
          "values": true
        },
        "tooltip": {
          "mode": "single",
          "sort": "none"
        }
      },
      "targets": [
        {
          "datasource": {
            "type": "prometheus",
            "uid": "f1TL-3BVz"
          },
          "editorMode": "code",
          "exemplar": false,
          "expr": "count(aemon_peer_info{networkId=\"$networkId\"}) by (vendor)",
          "format": "table",
          "instant": true,
          "legendFormat": "__auto",
          "range": false,
          "refId": "A"
        }
      ],
      "title": "Vendors",
      "type": "piechart"
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "f1TL-3BVz"
      },
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "hideFrom": {
              "legend": false,
              "tooltip": false,
              "viz": false
            }
          },
          "mappings": []
        },
        "overrides": []
      },
      "gridPos": {
        "h": 7,
        "w": 6,
        "x": 18,
        "y": 0
      },
      "id": 8,
      "options": {
        "legend": {
          "displayMode": "list",
          "placement": "bottom",
          "showLegend": true
        },
        "pieType": "pie",
        "reduceOptions": {
          "calcs": [
            "lastNotNull"
          ],
          "fields": "",
          "values": true
        },
        "tooltip": {
          "mode": "single",
          "sort": "none"
        }
      },
      "targets": [
        {
          "datasource": {
            "type": "prometheus",
            "uid": "f1TL-3BVz"
          },
          "editorMode": "code",
          "exemplar": false,
          "expr": "count(aemon_peer_info{networkId=\"$networkId\"}) by (os)",
          "format": "table",
          "instant": true,
          "legendFormat": "__auto",
          "range": false,
          "refId": "A"
        }
      ],
      "title": "Operating Systems",
      "type": "piechart"
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "f1TL-3BVz"
      },
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "hideFrom": {
              "legend": false,
              "tooltip": false,
              "viz": false
            }
          },
          "mappings": []
        },
        "overrides": []
      },
      "gridPos": {
        "h": 7,
        "w": 12,
        "x": 0,
        "y": 7
      },
      "id": 13,
      "options": {
        "displayLabels": [],
        "legend": {
          "displayMode": "table",
          "placement": "right",
          "showLegend": true,
          "values": [
            "percent"
          ]
        },
        "pieType": "pie",
        "reduceOptions": {
          "calcs": [
            "lastNotNull"
          ],
          "fields": "",
          "values": true
        },
        "tooltip": {
          "mode": "single",
          "sort": "none"
        }
      },
      "pluginVersion": "9.4.7",
      "targets": [
        {
          "datasource": {
            "type": "prometheus",
            "uid": "f1TL-3BVz"
          },
          "editorMode": "code",
          "exemplar": false,
          "expr": "topk(7, count(aemon_peer_status{networkId=\"$networkId\"}) by (country))",
          "format": "table",
          "instant": true,
          "legendFormat": "__auto",
          "range": false,
          "refId": "A"
        }
      ],
      "title": "Top Countries",
      "transformations": [
        {
          "id": "organize",
          "options": {
            "excludeByName": {
              "Time": true
            },
            "indexByName": {},
            "renameByName": {}
          }
        }
      ],
      "type": "piechart"
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "f1TL-3BVz"
      },
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "palette-classic"
          },
          "custom": {
            "hideFrom": {
              "legend": false,
              "tooltip": false,
              "viz": false
            }
          },
          "mappings": []
        },
        "overrides": []
      },
      "gridPos": {
        "h": 7,
        "w": 12,
        "x": 12,
        "y": 7
      },
      "id": 14,
      "options": {
        "displayLabels": [],
        "legend": {
          "displayMode": "table",
          "placement": "right",
          "showLegend": true,
          "values": [
            "percent"
          ]
        },
        "pieType": "pie",
        "reduceOptions": {
          "calcs": [
            "lastNotNull"
          ],
          "fields": "",
          "values": true
        },
        "tooltip": {
          "mode": "single",
          "sort": "none"
        }
      },
      "pluginVersion": "9.4.7",
      "targets": [
        {
          "datasource": {
            "type": "prometheus",
            "uid": "f1TL-3BVz"
          },
          "editorMode": "code",
          "exemplar": false,
          "expr": "topk(7, count(aemon_peer_status{networkId=\"$networkId\"}) by (provider))",
          "format": "table",
          "instant": true,
          "legendFormat": "__auto",
          "range": false,
          "refId": "A"
        }
      ],
      "title": "Top  Providers",
      "transformations": [
        {
          "id": "organize",
          "options": {
            "excludeByName": {
              "Time": true
            },
            "indexByName": {},
            "renameByName": {}
          }
        }
      ],
      "type": "piechart"
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "f1TL-3BVz"
      },
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "fixed"
          },
          "custom": {
            "align": "left",
            "cellOptions": {
              "type": "auto"
            },
            "filterable": true,
            "inspect": false
          },
          "links": [
            {
              "targetBlank": true,
              "title": "",
              "url": "./d/nAjf9tLVk/aeternity-p2p-monitor-peer?var-publicKey=${__data.fields.publicKey}&${__url_time_range}"
            }
          ],
          "mappings": [],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "green",
                "value": null
              }
            ]
          }
        },
        "overrides": [
          {
            "matcher": {
              "id": "byName",
              "options": "status"
            },
            "properties": [
              {
                "id": "mappings",
                "value": [
                  {
                    "options": {
                      "0": {
                        "color": "orange",
                        "index": 0,
                        "text": "disconnected"
                      },
                      "1": {
                        "color": "green",
                        "index": 1,
                        "text": "connected"
                      }
                    },
                    "type": "value"
                  }
                ]
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "kind (last)"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 113
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "host (last)"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 124
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "port (last)"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 104
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "publicKey"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 502
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "revision (last)"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 128
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "os (last)"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 99
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "vendor (last)"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 195
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "owner (last)"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 122
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "country (last)"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 86
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "host"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 127
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "port"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 67
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "provider"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 317
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "country"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 88
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "revision"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 103
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "owner"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 88
              }
            ]
          },
          {
            "matcher": {
              "id": "byName",
              "options": "kind"
            },
            "properties": [
              {
                "id": "custom.width",
                "value": 62
              }
            ]
          }
        ]
      },
      "gridPos": {
        "h": 14,
        "w": 24,
        "x": 0,
        "y": 14
      },
      "id": 4,
      "options": {
        "footer": {
          "countRows": false,
          "enablePagination": true,
          "fields": "",
          "reducer": [
            "sum"
          ],
          "show": false
        },
        "showHeader": true,
        "sortBy": []
      },
      "pluginVersion": "9.4.7",
      "targets": [
        {
          "datasource": {
            "type": "prometheus",
            "uid": "f1TL-3BVz"
          },
          "editorMode": "code",
          "exemplar": false,
          "expr": "aemon_peer_status{networkId=\"$networkId\"} * on (publicKey) group_left(version, revision, vendor, os) aemon_peer_info{networkId=\"$networkId\"} or on (publicKey) aemon_peer_status{networkId=\"$networkId\"}",
          "format": "table",
          "hide": false,
          "instant": true,
          "legendFormat": "__auto",
          "range": false,
          "refId": "A"
        }
      ],
      "title": "Peer List",
      "transformations": [
        {
          "id": "groupBy",
          "options": {
            "fields": {
              "Time": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "Value": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "country": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "host": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "kind": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "os": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "owner": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "port": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "provider": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "publicKey": {
                "aggregations": [
                  "last"
                ],
                "operation": "groupby"
              },
              "revision": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "vendor": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "version": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              }
            }
          }
        },
        {
          "id": "organize",
          "options": {
            "excludeByName": {
              "Time (last)": true
            },
            "indexByName": {
              "Time (last)": 2,
              "Value (last)": 12,
              "country (last)": 10,
              "host (last)": 3,
              "kind (last)": 0,
              "os (last)": 8,
              "owner (last)": 9,
              "port (last)": 4,
              "provider (last)": 11,
              "publicKey": 1,
              "revision (last)": 6,
              "vendor (last)": 7,
              "version (last)": 5
            },
            "renameByName": {
              "Time (last)": "",
              "Value (last)": "status",
              "country (last)": "country",
              "host (last)": "host",
              "kind (last)": "kind",
              "os (last)": "os",
              "owner (last)": "owner",
              "port (last)": "port",
              "provider (last)": "provider",
              "publicKey": "",
              "revision (last)": "revision",
              "vendor (last)": "vendor",
              "version (last)": "version"
            }
          }
        }
      ],
      "type": "table"
    },
    {
      "datasource": {
        "type": "prometheus",
        "uid": "f1TL-3BVz"
      },
      "description": "",
      "fieldConfig": {
        "defaults": {
          "color": {
            "mode": "fixed"
          },
          "custom": {
            "hideFrom": {
              "legend": false,
              "tooltip": false,
              "viz": false
            }
          },
          "links": [
            {
              "targetBlank": true,
              "title": "",
              "url": "./d/nAjf9tLVk/aeternity-p2p-monitor-peer?var-publicKey=${__data.fields.publicKey}&${__url_time_range}"
            }
          ],
          "mappings": [
            {
              "options": {
                "0": {
                  "color": "orange",
                  "index": 0,
                  "text": "disconnected"
                },
                "1": {
                  "color": "green",
                  "index": 1,
                  "text": "connected"
                }
              },
              "type": "value"
            }
          ],
          "thresholds": {
            "mode": "absolute",
            "steps": [
              {
                "color": "red",
                "value": null
              }
            ]
          },
          "unit": "none"
        },
        "overrides": []
      },
      "gridPos": {
        "h": 16,
        "w": 24,
        "x": 0,
        "y": 28
      },
      "id": 2,
      "options": {
        "basemap": {
          "config": {
            "showLabels": true,
            "theme": "auto"
          },
          "name": "Layer 0",
          "type": "carto"
        },
        "controls": {
          "mouseWheelZoom": true,
          "showAttribution": true,
          "showDebug": false,
          "showMeasure": false,
          "showScale": false,
          "showZoom": true
        },
        "layers": [
          {
            "config": {
              "showLegend": true,
              "style": {
                "color": {
                  "field": "Value #Peers",
                  "fixed": "dark-green"
                },
                "opacity": 0.4,
                "rotation": {
                  "fixed": 0,
                  "max": 360,
                  "min": -360,
                  "mode": "mod"
                },
                "size": {
                  "fixed": 5,
                  "max": 15,
                  "min": 2
                },
                "symbol": {
                  "fixed": "img/icons/marker/circle.svg",
                  "mode": "fixed"
                },
                "textConfig": {
                  "fontSize": 12,
                  "offsetX": 0,
                  "offsetY": 0,
                  "textAlign": "center",
                  "textBaseline": "middle"
                }
              }
            },
            "filterData": {
              "id": "byRefId",
              "options": "Peers"
            },
            "location": {
              "mode": "auto"
            },
            "name": "Peers",
            "tooltip": true,
            "type": "markers"
          },
          {
            "config": {
              "showLegend": true,
              "style": {
                "color": {
                  "field": "Value #Seeds",
                  "fixed": "dark-green"
                },
                "opacity": 0.4,
                "rotation": {
                  "fixed": 0,
                  "max": 360,
                  "min": -360,
                  "mode": "mod"
                },
                "size": {
                  "fixed": 15,
                  "max": 15,
                  "min": 2
                },
                "symbol": {
                  "fixed": "img/icons/marker/star.svg",
                  "mode": "fixed"
                },
                "text": {
                  "fixed": "",
                  "mode": "field"
                },
                "textConfig": {
                  "fontSize": 12,
                  "offsetX": 0,
                  "offsetY": 0,
                  "textAlign": "center",
                  "textBaseline": "middle"
                }
              }
            },
            "filterData": {
              "id": "byRefId",
              "options": "Seeds"
            },
            "location": {
              "latitude": "lat (last)",
              "longitude": "lon (last)",
              "mode": "auto"
            },
            "name": "Seeds",
            "tooltip": true,
            "type": "markers"
          }
        ],
        "tooltip": {
          "mode": "details"
        },
        "view": {
          "allLayers": true,
          "id": "fit",
          "lat": 0,
          "lon": 2.534735,
          "zoom": 10
        }
      },
      "pluginVersion": "9.4.7",
      "targets": [
        {
          "datasource": {
            "type": "prometheus",
            "uid": "f1TL-3BVz"
          },
          "editorMode": "code",
          "exemplar": false,
          "expr": "sum without(__name__, Time, instance, job, country, networkId) (aemon_peer_status{networkId=\"$networkId\", lat != \"0\", kind=\"seed\"})",
          "format": "table",
          "hide": false,
          "instant": true,
          "legendFormat": "__auto",
          "range": false,
          "refId": "Seeds"
        },
        {
          "datasource": {
            "type": "prometheus",
            "uid": "f1TL-3BVz"
          },
          "editorMode": "code",
          "exemplar": false,
          "expr": "sum without(__name__, Time, instance, job, country, networkId) (aemon_peer_status{networkId=\"$networkId\", lat!=\"0\", kind!=\"seed\"})",
          "format": "table",
          "hide": false,
          "instant": true,
          "legendFormat": "__auto",
          "range": false,
          "refId": "Peers"
        }
      ],
      "title": "Peer Geo Locations",
      "transformations": [
        {
          "disabled": true,
          "id": "groupBy",
          "options": {
            "fields": {
              "Value": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "Value #A": {
                "aggregations": [
                  "last"
                ]
              },
              "Value #B": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "Value #Peers": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "Value #Seeds": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "Value #Test123": {
                "aggregations": [
                  "last"
                ]
              },
              "lat": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "lon": {
                "aggregations": [
                  "last"
                ],
                "operation": "aggregate"
              },
              "publicKey": {
                "aggregations": [],
                "operation": "groupby"
              }
            }
          }
        },
        {
          "disabled": true,
          "id": "convertFieldType",
          "options": {
            "conversions": [
              {
                "destinationType": "number",
                "targetField": "lat"
              },
              {
                "destinationType": "number",
                "targetField": "lon"
              }
            ],
            "fields": {}
          }
        }
      ],
      "type": "geomap"
    }
  ],
  "refresh": "",
  "revision": 1,
  "schemaVersion": 38,
  "style": "dark",
  "tags": [],
  "templating": {
    "list": [
      {
        "current": {
          "selected": false,
          "text": "ae_uat",
          "value": "ae_uat"
        },
        "datasource": {
          "type": "prometheus",
          "uid": "f1TL-3BVz"
        },
        "definition": "label_values(networkId)",
        "hide": 0,
        "includeAll": false,
        "label": "Network",
        "multi": false,
        "name": "networkId",
        "options": [],
        "query": {
          "query": "label_values(networkId)",
          "refId": "StandardVariableQuery"
        },
        "refresh": 1,
        "regex": "",
        "skipUrlSync": false,
        "sort": 0,
        "type": "query"
      }
    ]
  },
  "time": {
    "from": "now-6h",
    "to": "now"
  },
  "timepicker": {},
  "timezone": "",
  "title": "Aeternity P2P Monitor - Peers",
  "uid": "I1jhkCL4k",
  "version": 13,
  "weekStart": ""
}