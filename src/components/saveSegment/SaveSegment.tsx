import React, { useEffect, useState } from "react";
import "./SaveSegment.css";
import { toast } from "react-toastify";

interface FormData {
  segment_name: string;
  schema: any[];
}

const SaveSegment: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const initialValue = [
    { id: 1, Label: "First Name", Value: "", fieldType: "text", filter: false },
    { id: 2, Label: "Last Name", Value: "", fieldType: "text", filter: false },
    { id: 3, Label: "Gender", Value: "", fieldType: "select", filter: false },
    { id: 4, Label: "Age", Value: "", fieldType: "number", filter: false },
    { id: 5, Label: "Account Name", Value: "", fieldType: "text", filter: false },
    { id: 6, Label: "City", Value: "", fieldType: "select", filter: false },
    { id: 7, Label: "State", Value: "", fieldType: "select", filter: false },

  ]
  const [addSchemaDropdown, setAddSchemaDropdown] = useState(initialValue);

  const [formData, setFormData] = useState<FormData>({
    segment_name: "",
    schema: []
  });

  const handleInputChange = (fieldName: keyof FormData, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]:
        fieldName === "schema" ? [
            ...prevData.schema
              .filter((schem) =>
                addSchemaDropdown.some(
                  (addschem) => addschem.id === schem.id && addschem.filter === true
                )
              ),
            JSON.parse(value),
          ]
          : value,
    }));
    console.log(addSchemaDropdown)
  };

  const handleAddSchema = () => {
    const updatedDropdown = addSchemaDropdown.map((item) => ({
      ...item,
      filter: formData.schema.some((schema) => schema.id === item.id),
    }));
    setAddSchemaDropdown(updatedDropdown);
  };

  const handleClear = (Id: number) => {
    let clearedSchema = addSchemaDropdown.map((schema) => {
      return {
        ...schema,
        filter: schema.id == Id ? false : schema.filter,
        Value: ""
      }
    })
    const existingSchema = clearedSchema
      .filter((schema) => schema.filter === true)
      .map((schema) => ({
        ...schema,
      }));
    setAddSchemaDropdown(clearedSchema)
    setFormData((prev) => ({
      ...prev,
      schema: existingSchema
    }))
  }

  const removeAll = () => {
    let clearedSchema = addSchemaDropdown.map((schema) => {
      return {
        ...schema,
        filter: false,
        Value: ""
      }
    })
    setAddSchemaDropdown(clearedSchema)
    setFormData((prev) => ({
      ...prev,
      schema: []
    }))
  }

  const handleUpdateValue = (id: number, value: string) => {

    let changedValues = addSchemaDropdown.map((data) => {
      return {
        ...data,
        Value: data.id == id ? value : data.Value
      }
    })

    setAddSchemaDropdown(changedValues)

  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let payload = {
      segment_name: formData.segment_name,
      schema: addSchemaDropdown
    }

    payload.schema.map((data: any) => {
      if (data.fieldType == "select") {
        if (data.Value) {
          const parsedValue = JSON.parse(data.Value);
          data.Value = parsedValue.Label
        }
      }
    })
    payload.schema = payload.schema.filter((list) => list.filter)

    let sortedPayload: any[] = payload.schema.map((data) => {
      data.Value = data.Value.replace(" ", "_");
      return {
        [data.Value]: data.Label
      }
    })

    payload.schema = sortedPayload;
    console.log(payload)

    try {
      const response = await fetch("https://webhook.site/6b3911e9-132d-4a1e-9c84-009d95e5f353", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "no-cors"
      });
      setAddSchemaDropdown(initialValue)
      setFormData((prev) => ({
        ...prev,
        segment_name: "",
        schema: []
      }))
      toast.success("Form Saved Successfully!!!");
    } catch (err) {
      console.log(err)
      toast.error("Unable to Save Form!!!");
    }



  }

  useEffect(() => {
    console.log("addSchemaDropdown", addSchemaDropdown);
  }, [addSchemaDropdown]);

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="Segment_Button"
      >
        Save Segment
      </button>

      <div className={`side-panel pt-0 px-12px pb-0 ${isOpen ? "open" : ""}`}>
        <div className="side-panel-content">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 saving-segment d-flex">
                <span><i className="fa-solid fa-arrow-left cursor-pointer" onClick={() => setIsOpen(false)}></i></span>
                <h5 className="mx-2">Saving Segment</h5>
              </div>
            </div>


            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 mt-4">
                <label className="form-label">Enter the Name of the Segment</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name of the segment"
                  onChange={(e) => handleInputChange("segment_name", e.target.value)}
                  value={formData.segment_name}
                />
              </div>
              <p className="mt-4">To save your segment, you need to add the schemas to build the query</p>
            </div>


            <div className="row">
              <div className="col-12">
                {addSchemaDropdown.filter((x) => x.filter).map((item, index) => (
                  <div key={item.id} className="mb-3">
                    <label className="form-label">{item.Label}</label>

                    {item.fieldType === "text" && <>
                      <div className="d-flex align-items-center gap-3">
                        <input
                          onChange={(e) => handleUpdateValue(item.id, e.target.value)}
                          type="text"
                          className="form-control w-75"
                          placeholder={`Enter ${item.Label}`}
                        />
                        <i className="fa-solid fa-minus fs-5 text-danger remove-icon-align" onClick={() => handleClear(item.id)}></i>
                      </div>
                    </>
                    }

                    {item.fieldType === "number" && <>
                      <div className="d-flex align-items-center gap-3">
                        <input
                          type="number"
                          className="form-control w-75"
                          max={100}
                          min={1}
                          onChange={(e) => handleUpdateValue(item.id, e.target.value)}
                        />
                        <i className="fa-solid fa-minus fs-5 text-danger remove-icon-align" onClick={() => handleClear(item.id)} ></i>
                      </div>
                    </>
                    }

                    {item.fieldType === "select" && <>
                      <div className="d-flex align-items-center gap-3">
                        <select className="form-select w-75" onChange={(e) => handleUpdateValue(item.id, e.target.value)}>
                          <option value="">Select an option</option>
                          {addSchemaDropdown.filter((x) => !x.filter).map((item) => (
                            <option key={item.id} value={JSON.stringify(item)}>{item.Label}</option>
                          ))}
                        </select>
                        <i className="fa-solid fa-minus fs-5 text-danger remove-icon-align" onClick={() => handleClear(item.id)} ></i>
                      </div>
                    </>
                    }
                  </div>
                ))}
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12 d-flex align-items-center gap-3">
                <select className="form-select w-75" onChange={(e) => handleInputChange("schema", e.target.value)}>
                  <option value="">Add Schema to Segment</option>
                  {addSchemaDropdown.filter((x) => !x.filter).map((item) => (
                    <option key={item.id} value={JSON.stringify(item)}>{item.Label}</option>
                  ))}
                </select>

                <i className="fa-solid fa-minus fs-5 text-danger remove-icon-align" onClick={removeAll}></i>
              </div>
              <div className="col-12 mt-2 color-default">
                <i className="fa-solid fa-plus"></i>
                <a className="color-default anchor-border-bottom" href="#" onClick={handleAddSchema}>Add New Schema</a>
              </div>
            </div>





            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 bg-secondary-footer fixed-bottom-div mt-4">
                <button
                  type="submit"
                  onClick={() => console.log(false)}
                  className="submit-button mx-2"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="close-button"
                >
                  Close
                </button>
              </div>
            </div>

          </form>

        </div>
      </div>

      {isOpen && <div className="overlay" onClick={() => setIsOpen(true)}></div>}
    </>
  );
};

export default SaveSegment;
