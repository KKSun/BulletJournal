package com.bulletjournal.repository.models;

import org.apache.commons.lang3.StringUtils;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Objects;

@MappedSuperclass
public abstract class NamedModel extends AuditModel {

    @NotBlank
    @Size(min = 1, max = 100)
    @Column(length = 100, nullable = false)
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (StringUtils.isBlank(name)) {
            name = "Transaction by System";
        }
        this.name = name;
    }

    public abstract Long getId();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof NamedModel)) return false;
        NamedModel that = (NamedModel) o;
        return Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
