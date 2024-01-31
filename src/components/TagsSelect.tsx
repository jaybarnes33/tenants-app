import React from "react";

import Select, { StylesConfig } from "react-select";

const unitTypes = [
  { value: "studio", label: "Studio Apartment" },
  { value: "1br", label: "1 Bedroom (1BR)" },
  { value: "2br", label: "2 Bedrooms (2BR)" },
  { value: "3br", label: "3 Bedrooms (3BR)" },
  { value: "loft", label: "Loft" },
  { value: "duplex", label: "Duplex" },
];

const Component = ({ multi }: { multi?: boolean }) => (
  <Select closeMenuOnSelect={false} isMulti={multi} options={unitTypes} />
);

export default Component;
