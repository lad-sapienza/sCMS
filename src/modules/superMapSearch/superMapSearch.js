import React, { useState } from "react";
import styled from "styled-components";
import { MapLibre, Search, VectorLayerLibre } from "../scms";

// Funzioni di conversione
import plain2directus from "../../services/directus/form2querystring";

const SuperMapSearch = ({
  center,
  baseLayers,
  fieldList,
  searchProps,
  source,
  resultItemTemplate,
  children,
  limitTo,
}) => {
  // Stato per la “source” usata dal VectorLayerLibre
  const [mapSource, setMapSource] = useState(source);

  // Stato per eventuali filtri locali in stile MapLibre
  const [filters, setFilters] = useState(null);

  // handleSearch: riceve l’array generico, es.:
  // [ {field:"Item_Label", operator:"_icontains", value:"KM 197"}, ... ]
  const handleSearch = (newFilters) => {
    console.log("[SuperMapSearch] handleSearch con filtri (array):", newFilters);

    // 1) Creiamo l’oggetto Directus con plain2directus
    //    Passiamo `mapSource` o `source` come conn, e `newFilters` come inputs
    const directusObj = plain2directus(mapSource, newFilters);
    console.log(" directusObj come in search.js:", directusObj);

    // 2) Convertiamo in stringa JSON
    const directusFilterString = JSON.stringify(directusObj);
    console.log("directusFilterString:", directusFilterString);
    console.log("`resultItemTemplate` ricevuto in SuperMapSearch:", resultItemTemplate);
  
    // 3) Aggiorniamo mapSource.directus.queryString
    setMapSource((prev) => {
      const updatedSource = {
        ...prev,
        directus: {
          ...prev.directus,
          queryString: directusFilterString ? `filter=${encodeURIComponent(directusFilterString)}` : ""
        }
      };
      console.log("Nuovo stato di mapSource:", updatedSource);
      return updatedSource;
    });
    
  };

  return (
    <Container>
      <MapContainer>
        <MapLibre center={center} baseLayers={baseLayers}>
          {React.Children.map(children, (child) => {
            if (child.type === VectorLayerLibre) {
              // Sovrascriviamo “source” e “filters” del child
              return React.cloneElement(child, {
                source: mapSource, // Ecco la "nuova" source con queryString aggiornato
                filters: filters,  // Se VectorLayerLibre supporta filtri locali
              });
            }
            return child;
          })}
        </MapLibre>
      </MapContainer>


      <SearchContainer>
        <Search
        limitTo={limitTo}
          source={mapSource} // la query per l’elenco la fa "search.js"
          fieldList={fieldList}
          onSearch={handleSearch} // callback che aggiorna mapSource e filters
          resultItemTemplate={resultItemTemplate}
          {...searchProps}
        />
      </SearchContainer>
    </Container>
  );
};

export { SuperMapSearch };


const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

const MapContainer = styled.div`
  flex: 2;
  border-right: 1px solid #ccc;
  background: #f0f0f0;
`;

const SearchContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: white;
`;
